FROM golang:1.21-alpine AS builder
WORKDIR /project
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o build/fizzbuzz

FROM gcr.io/distroless/static-debian10
WORKDIR /project
COPY --from=builder /project/templates ./templates
COPY --from=builder /project/build/fizzbuzz ./fizzbuzz
CMD ["./fizzbuzz", "serve"]